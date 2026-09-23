@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Hi {{$demo->name}},</td>
</tr>
<tr>
    <td colspan="2">Here’s the 1 page <a href="{{ url('/') }}/pdf/TerriTool-Trial-Instructions.pdf">guide</a> on how to make the most of <b>your territory</b> using TerriTool.</td>
</tr>
<tr>
    <td colspan="2">If you’d like to talk to someone from the team, you can always schedule a time <a href="https://calendly.com/d/dz38-bvg-j22/territool-zoom-demo">here</a>.</td>
</tr>
<tr>
    <td colspan="2">All the best!</td>
</tr>
<tr>
    <td colspan="2">--</td>
</tr>
<tr>
    <td colspan="2">
        Jack Traxler<br/>
        480-319-5983<br/>
        jack@territool.com 
    </td>
</tr>
@endsection