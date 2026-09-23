@extends('mails.layoutroute')
@section('body')

<tr>
	<td colspan="2">Hello {{$demo->name}},</td>
</tr>
<tr>
    <td colspan="2">Your TerriTool trial extension has expired. <a href="{{ URL::to('/') }}/subscription/subscribe" target="_blank">Click here</a> to activate your subscription.</td>
</tr>
<tr>
    <td colspan="2">Feel free to schedule a one-on-one zoom call using the link below or email support@territool.com for assistance.</td>
</tr>
<tr>
    <td colspan="2"><a href="https://calendly.com/territool/territool-zoom">https://calendly.com/territool/territool-zoom</a></td>
</tr>
<tr>
    <td colspan="2">--</td>
</tr>
<tr>
    <td colspan="2">
        Spencer Kelleher<br/>
        (949) 274-5011<br/>
        spencer@territool.com
    </td>
</tr>

@endsection