@extends('mails.layoutroute')
@section('body')

<tr>
	<td colspan="2">Dear {{ $demo->name }},</td>
</tr>
<tr>
	<td colspan="2">{{ $demo->message }}</td>
</tr>
<tr>
	<td colspan="2">You can view your route on map by clicking <a href="{{$demo->userRouteLink}}" class="btn btn-xs btn-default"><i class="fa fa-eye"></i> Here </a></td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
            
@endsection